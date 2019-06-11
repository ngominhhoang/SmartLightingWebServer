// hello.cc
#include <node.h>
#include <queue>
#include <iostream>
#include <fstream>
#include <stdlib.h>
#include <ctime>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;
using v8::Value;
using v8::Number;
using v8::Array;
using v8::Integer;

using namespace std;
ifstream fi("input.txt");
ofstream fo("output_toiuu.txt");
#define cout fo
const double INTMAX = 1000000;
const double alpha = 1.3;
const double beta = 10;
const double threshold = 0.1;
int n,m,c,LX[101],E[101],L[101][101],O[101],res,Near[101][101],lv[101];
int sol[101],obj[101];
typedef pair<int,int> Pa ;
typedef pair<double,Pa> Pb;
int illu_value[101];
priority_queue<Pa,vector<Pa>,less<Pa> > pQ;

double power(double al, int expo) {
    if (expo <= 0) return 0;
    if (expo > 50) return INTMAX;
    if (expo == 0) return 1;
    if (expo == 1) return al;
    double cmp = power(al, expo/2);
    if (expo % 2 == 0) return min(INTMAX,cmp*cmp); else return min(INTMAX,cmp*cmp*al);
}

struct Gene {
    int data;
    Gene* next;
    Gene(int x){
        data = x;
        next = NULL;
    }
    ~Gene() {
        delete next;
    }
};

struct Chromosome {
    public:
    int length = 0;
    double fitness = INTMAX;
    double electric_value = INTMAX;
    Gene* firstGene;
    Chromosome* next;
    Chromosome() {
        next = NULL;
        length = 0;
    }
    void addGene(Gene* gene) {
        if (length == 0) firstGene = gene; else {
            Gene* ptr = firstGene;
            while (ptr->next != NULL) ptr = ptr->next;
            ptr->next = gene;

        }
        ++length;
    }

    bool isFull() {
        return length == m;
    }

    bool evaluateFitness() {
            if (!isFull()) {
                cout<<"Error!!!Not enough genes for evaluate!!!";
                return false;
            }
            Gene* ptr = firstGene;
            fitness = 0;
            electric_value = 0;
            int x[30];
            int i=0;
            while (ptr != NULL) {
                x[i] = ptr->data;
                ++i;
                ptr = ptr->next;
            }
            for (int i=0; i<m; ++i) {
                fitness = fitness + E[i]*x[i];
            }
            electric_value = fitness;
            int expo = 0;
            for (int j=0; j<n; ++j) {
                if (O[j] == -1) {
                    continue;
                }
                int sum_illu = 0;
                for (int i=0; i<m; ++i) {
                    sum_illu += L[i][j]*x[i];
                }
                //cout << fixed << setprecision(6) << sum_illu <<endl;
                sum_illu = LX[j] + sum_illu;
                sum_illu = O[j] - sum_illu;

                sum_illu = sum_illu / beta;
                fitness = fitness + power(alpha, sum_illu);

                //cout << fixed << setprecision(6) << sum_illu<<endl;
            }

            return true;
        }

    Chromosome* local_optimal(int pos, int lv) {
        if (!isFull()) {
            cout<<"Error!!!Not enough genes for mix!!";
            return NULL;
        }
        Chromosome* ch = new Chromosome;
        Gene* g = this->firstGene;
        int idx = 0;
        while (g != NULL) {
            if (idx == pos) {
                ch->addGene(new Gene(lv));
            }
                else {
                ch->addGene(new Gene(g -> data));
            }
            g = g->next;
            ++idx;
        }
        return ch;
    }

    Chromosome* mix(Chromosome* pa2) {
        if (!isFull() || !pa2->isFull()) {
            cout<<"Error!!!Not enough genes for mix!!";
            return NULL;
        }

        Chromosome* pa1=this,*child = new Chromosome;
        int splitP1 = rand()%(length/2)+1;
        int splitP2 = splitP1+rand()%(length/2)+1;
        Gene* ptr1 = pa1->firstGene;
        Gene* ptr2 = pa2->firstGene;
        int i=0;
        while (ptr1!=NULL && ptr2!=NULL) {
            if (splitP1<=i && i<=splitP2) {
                child->addGene(new Gene(ptr1->data));
            }
                else {
                child->addGene(new Gene(ptr2->data));
            }
            ++i;
            ptr1 = ptr1->next;
            ptr2 = ptr2->next;
        }
        return child;
    }

    void write() {
        cout << fitness << endl;
        Gene* ptr = firstGene;
        while (ptr != NULL) {
            cout<<ptr->data<<' ';
            ptr = ptr->next;
        }
        cout << endl;
    }
};

struct Population {
    int length = 0;
    double delta = 0;
    Chromosome* firstChromo = NULL;
    Population() {
        length = 0;
        firstChromo = NULL;
    }

    bool checkCoincident(Chromosome* chromo) {
        bool check = false;
        if (length == 0) return check;
        Chromosome *ptr = firstChromo;
        while (ptr!=NULL) {
            if (abs(ptr->fitness - chromo->fitness) <= delta) {
                check = true;
                break;
            }
            ptr = ptr->next;
        }
        //if (check) cout<<"haha";
        return check;
    }

    void addChromosome(Chromosome* chromo) {
        if (!chromo->evaluateFitness()) {
            cout << "Cannot add chromosome";
            return;
        };
        if (checkCoincident(chromo)) {
            //cout << "Chromosome has already existed in the population";
            return;
        }
        if (length == 0) firstChromo = chromo; else {
            Chromosome* ptr = firstChromo;

            if (ptr->fitness > chromo->fitness) {
                chromo->next = ptr;
                firstChromo = chromo;
            }
            else {
                while (ptr->next != NULL&&ptr->next->fitness < chromo->fitness) ptr = ptr->next;
                chromo->next = ptr->next;
                ptr->next = chromo;
            }
        }
        ++length;
    }

    void terminateChromosome(int volume) {
        if (length<volume) return;
        if (volume == 0) {
            length = 0;
            firstChromo = NULL;
            return;
        }
        Chromosome* ptr = firstChromo;
        for (int i=0;i<volume-1;++i) {
            ptr = ptr->next;
        }
        ptr->next = NULL;
        length = volume;
    }

    double topFitness(int rankk) {
        Chromosome *ptr = firstChromo;
        int minRankk = min(rankk,length);
        for (int i=0;i<minRankk-1;++i)
            ptr = ptr->next;
        return ptr->fitness;
    }

    void write() {
        Chromosome* ptr = firstChromo;
        while (ptr != NULL) {
            ptr->write();
            ptr = ptr->next;
        }
    }
};

Population P;

void Termination() {
    P.terminateChromosome(30);
}

void Mutation_ver1() {
    Chromosome *ptr = P.firstChromo;
    int idx = 0, len = P.length;

    while (idx < len) {
        int elec_value = ptr->electric_value;
        //orig_value : gia tri ban dau cua chromosome
        //illu_value : gia tri anh sang cua chromosome
        //elec_value : gia tri dien nang tieu thu cua chromosome
        for (int j=0; j<n; ++j) {
            illu_value[j] = LX[j]-O[j];
            if (O[j] == -1) {
                illu_value[j] = INTMAX;
                continue;
            }
            //cout<<illu_value[1];
            Gene* gx = ptr->firstGene;
            for (int i=0; i<m; ++i) {
                illu_value[j] = illu_value[j] + L[i][j]*(gx->data);
                gx = gx->next;
            }
        }



        Gene* g = ptr->firstGene;
        int index_g = 0;
        while (g != NULL) {
            int coeff = g->data;
            double sum_min = INTMAX;
            int saved = -1;

            for (int k=0; k<c; ++k) {
                double sum = 0;
                for (int j=0; j<n; ++j) {
                    if (O[j] == -1) {continue;}
                    int expo = illu_value[j] + L[index_g][j]*(k - coeff);
                    expo = abs(expo);
                    expo = expo/beta;

                    sum = sum + power(alpha, expo);
                }

                sum += elec_value+E[index_g]*(k - coeff);
                if (sum < sum_min) {
                    sum_min = sum;
                    saved = k;
                }
            }

            if (sum_min < P.topFitness(5)) {
                P.addChromosome(ptr->local_optimal(index_g,saved));
            }
            g = g->next;
            ++index_g;
        }
        ++idx;
        ptr = ptr->next;
    }
}

void Crossover() {
    Chromosome* ptr1 = P.firstChromo;
    int iCount = 0,iLen = P.length;
    while (iCount<iLen) {
        Chromosome* ptr2 = ptr1->next;
        int jCount = iCount+1;
        while (jCount<iLen) {
            //cout<<iCount<<' '<<jCount<<endl;
            Chromosome* C = ptr1->mix(ptr2);
            P.addChromosome(C);
            //C->writeAll();
            C = ptr2->mix(ptr1);
            P.addChromosome(C);
            //C->writeAll();
            ptr2 = ptr2->next;
            ++jCount;
        }
        ++iCount;
        ptr1 = ptr1->next;
    }
    //cout<<endl;
    //P.write();
}

void Initialization() {
    for (int iP=0; iP<50; ++iP) {
        for (int j=0; j<n; ++j) {
            Chromosome* ch = new Chromosome;
            if (O[j] == -1) continue;
            while (!pQ.empty()) {
                pQ.pop();
            }
            for (int i=0; i<m; ++i) {
                pQ.push(make_pair(L[i][j],i));
            }
            int countt = 0, remain = O[j] - LX[j], rand_value = (rand()%c)/3;
            //cout<<rand_value<<endl;
            for (int i=0; i<m; ++i) {
                lv[i] = rand_value;
            }
            for (int i=0; i<m; ++i) {
                remain = remain - L[i][j]*rand_value;
            }
            //if (rand_value == 1) cout<<remain<<endl;

            while (!pQ.empty()) {
                Pa cmp = pQ.top();
                pQ.pop();
                if (rand()%2 == 1) continue;
                int ii = cmp.second;
                int l=rand_value,r=c-1;
                while (l<=r) {
                    int m = (l+r)/2;
                    if (remain - L[ii][j]*m <= 0) {
                        r = m - 1;
                    }
                        else {
                        lv[ii] = m;
                        l = m + 1;
                    }
                }
                remain = remain - L[ii][j]*lv[ii];
            }
            for (int i=0; i<m; ++i) {
                //cout << lv[i]<<' ';
                Gene* g = new Gene(lv[i]);
                ch->addGene(g);
            }
            P.addChromosome(ch);
            //cout<<endl;
        }
    }
    P.write();
}

void Process_GA() {
    Initialization();
    double minFit = 0;
    clock_t start = clock();
    for (int i=1;i<=10;++i) {
        Crossover();
        //P.write();
        Mutation_ver1();
        //Mutation_ver2();

        Termination();
        //if ((clock()-start)/CLOCKS_PER_SEC > 60) break;
        //if (P.firstChromo->fitness == minFit || ((clock()-start)/CLOCKS_PER_SEC > 600)) break;
        //minFit = P.firstChromo->fitness;
    }
    //P.write();
    //cout<<fixed<<setprecision(3)<<((double)(clock()-start)/CLOCKS_PER_SEC);
    //int res = P.firstChromo->fitness;
    //fo<<res<<endl;//<<' '<<P.firstChromo->endPoint.size()<<endl;
    P.firstChromo->write();
}

void Clear() {
    P.terminateChromosome(0);
}

void Method(const FunctionCallbackInfo<Value>& args) {
      Isolate* isolate = args.GetIsolate();
      Local<Array> input = Local<Array>::Cast(args[0]);
      unsigned int num_locations = input->Length();
      Clear();
      n = input->Get(0)->ToInteger()->Value();
      m = input->Get(1)->ToInteger()->Value();
      c = input->Get(2)->ToInteger()->Value();

      for (int i = 0; i < n; ++i) {
        LX[i]  = input->Get(i+3)->ToInteger()->Value();
      }

      for (int i=0;i<m;++i) {
          E[i] = input->Get(i+n+3)->ToInteger()->Value();
      }

      for (int i=0;i<m;++i) {
          for (int j=0;j<n;++j) {
              L[i][j] = input->Get(i*m+j+m+n+3)->ToInteger()->Value();
          }
      }

      for (int i=0;i<n;++i) {
          O[i] = input->Get(i+m*n+m+n+3)->ToInteger()->Value();
      }
      Process_GA();

      Local<Array> myArray = Array::New(isolate);

      int value0 = P.firstChromo->firstGene->data;
      Local<Number> num0 = Number::New(isolate, value0);
      myArray->Set(0, num0);

      int value1 = P.firstChromo->firstGene->next->data;
      Local<Number> num1 = Number::New(isolate, value1);
      myArray->Set(1, num1);

      int value2 = P.firstChromo->firstGene->next->next->data;
      Local<Number> num2 = Number::New(isolate, value2);
      myArray->Set(2, num2);

      int value3 = P.firstChromo->firstGene->next->next->next->data;
      Local<Number> num3 = Number::New(isolate, value3);
      myArray->Set(3, num3);

      int value4 = P.firstChromo->firstGene->next->next->next->next->data;
      Local<Number> num4 = Number::New(isolate, value4);
      myArray->Set(4, num4);

      int value5 = P.firstChromo->firstGene->next->next->next->next->next->data;
      Local<Number> num5 = Number::New(isolate, value5);
      myArray->Set(5, num5);

      args.GetReturnValue().Set(myArray);
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo